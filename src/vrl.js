/*
Language: Vector Remap Language
Author: Jean Mertz <git@jeanmerz.com>
Description: Vector Remap Language (VRL) is an expression-oriented language
             designed for transforming observability data (logs and metrics) in
             a safe and performant manner. For info about language see
             http://vrl.dev/
Category: scripting
Website: https://vrl.dev
*/

/** @type LanguageFn */
export default function(hljs) {
  const regex = hljs.regex;

  const PUNCTUATION = {
    match: /[{}[\]\(\),:\?!]|->|\|(?!\|)/,
    className: "punctuation",
    relevance: 0
  };

  const FUNCTION_INVOKE = {
    className: "title.function.invoke",
    relevance: 0,
    begin: regex.concat(
      /\b/,
      hljs.IDENT_RE,
      regex.lookahead(/\s*\(/))
  };

  const OPERATOR = {
    className: "operator",
    begin: /[-+*/=%]|&&|!=?|\?|>=?|<=?|\|\|/,
    relevance: 0,
  };

  return {
    name: 'VRL',
    aliases: ['Vector Remap Language', 'vrl'],
    contains: [
      PUNCTUATION,
      OPERATOR,

      // # foo bar -- Comment
      hljs.HASH_COMMENT_MODE,

      // "foo"  -- String Literal
      // s'foo' -- Raw String Literal
      //
      // TODO: "{{foo}}" -- Templated String Literal
      {
        className: 'string',
        variants: [
          hljs.QUOTE_STRING_MODE,
          {
            begin: /s'/,
            end: /'/,
            beginScope: 'punctuation',
            endScope: 'punctuation',
            contains: [hljs.BACKSLASH_ESCAPE]
          },
        ]
      },

      // r'foo.*' -- Regex Literal
      {
        className: 'regexp',
        begin: /r'/,
        end: /'/,
        beginScope: 'punctuation',
        endScope: 'punctuation',
        contains: [hljs.BACKSLASH_ESCAPE]
      },

      // 12   -- Integer Literal
      // 12.3 -- Float Literal
      //
      // TODO: 120_000
      // TODO: 120_000.120_001
      {
        className: 'number',
        begin: '\\b(\\d[\\d_]*(\\.[0-9_]+)?)',
        relevance: 0
      },

      FUNCTION_INVOKE,

      {
        scope: 'literal',
        variants: [
          // t'2020-01-01T00:00:00.000Z' -- Timestamp Literal
          {
            begin: /t'/,
            end: /'/,
            beginScope: 'punctuation',
            endScope: 'punctuation',
            contains: [hljs.BACKSLASH_ESCAPE]
          },
          {
            begin: /true|false|null/
          }
        ]
      },

      {
        scope: "keyword",
        begin: /if|else|abort/
      },

      {
        scope: "symbol",
        begin: regex.concat(
          /\b/,
          hljs.UNDERSCORE_IDENT_RE,
          /:/)
      },

      {
        className: "variable.language",
        relevance: 0,
        variants: [
          {
            begin: regex.concat(
              /(^\s*|\b|])/,
              /\./,
              hljs.UNDERSCORE_IDENT_RE,
              regex.lookahead(/(\b|$)/))
          },
          { begin: /\./ }
        ]
      },

      {
        className: "variable",
        relevance: 0,
        begin: regex.concat(
          /\b/,
          hljs.UNDERSCORE_IDENT_RE,
          regex.lookahead(/(\b|$)/))
      }
    ]
  };
}
